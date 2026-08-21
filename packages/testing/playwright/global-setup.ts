import { request } from '@playwright/test';
import { setTimeout as wait } from 'node:timers/promises';

import { ApiHelpers } from './services/api-helper';
import { getBackendUrl } from './utils/url-helper';

async function globalSetup() {
	console.log('🚀 Starting global setup...');

	// Check if backend URL is set (N8N_BACKEND_URL or N8N_BASE_URL)
	const n8nBaseUrl = getBackendUrl();
	if (!n8nBaseUrl) {
		console.log('⚠️  N8N_BASE_URL environment variable is not set, skipping database reset');
		return;
	}

	const resetE2eDb = process.env.RESET_E2E_DB;
	if (resetE2eDb !== 'true') {
		console.log('⚠️  RESET_E2E_DB is not set to "true", skipping database reset');
		return;
	}

	console.log(`🔄 Resetting database for ${n8nBaseUrl}...`);
	// Create standalone API request context
	const requestContext = await request.newContext({
		baseURL: n8nBaseUrl,
	});

	try {
		const api = new ApiHelpers(requestContext);
		const deadline = Date.now() + 120_000;
		let databaseReset = false;

		while (!databaseReset) {
			try {
				await api.resetDatabase();
				databaseReset = true;
			} catch (error) {
				if (Date.now() >= deadline) throw error;
				await wait(500);
			}
		}
		console.log('✅ Database reset completed successfully');
	} catch (error) {
		console.error('❌ Failed to reset database', error);
		throw error; // This will fail the entire test suite if database reset fails
	} finally {
		await requestContext.dispose();
	}

	console.log('🏁 Global setup completed');
}

// eslint-disable-next-line import-x/no-default-export
export default globalSetup;
