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
		const readinessDeadline = Date.now() + 30_000;
		let e2eApiReady = false;
		while (Date.now() < readinessDeadline) {
			const response = await requestContext.get('/rest/e2e/env-feature-flags');
			// The editor fallback returns HTML with 200 before REST controllers are mounted.
			if (response.ok() && response.headers()['content-type']?.includes('application/json')) {
				e2eApiReady = true;
				break;
			}
			await wait(500);
		}

		if (!e2eApiReady) {
			throw new Error('Timed out waiting for E2E API routes');
		}

		const api = new ApiHelpers(requestContext);
		await api.resetDatabase();
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
