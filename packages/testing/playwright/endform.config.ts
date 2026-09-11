/* eslint-disable import-x/no-default-export */
import { defineEndformConfig } from 'endform';

export default defineEndformConfig({
	additionalFiles: ['workflows/**/*'],
	concurrentTestLimits: [{ scope: 'within-suite-run', limit: 4 }],
	environmentVariables: ['N8N_BASE_URL', 'RESET_E2E_DB', 'E2E_REMOTE_RUNNER'],
});
