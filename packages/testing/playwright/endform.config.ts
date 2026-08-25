/* eslint-disable import-x/no-default-export */
import { defineEndformConfig } from 'endform';

export default defineEndformConfig({
	additionalFiles: ['workflows/**/*', 'fixtures/**/*', 'expectations/**/*', 'tests/**/*'],
	concurrentTestLimits: [
		{ scope: 'within-suite-run', limit: Number(process.env.ENDFORM_CONCURRENCY ?? 1) },
	],
	environmentVariables: ['E2E_REMOTE_RUNNER', 'N8N_BASE_URL', 'RESET_E2E_DB'],
});
