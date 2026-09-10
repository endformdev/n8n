/* eslint-disable import-x/no-default-export */
import { defineEndformConfig } from 'endform';

export default defineEndformConfig({
	concurrentTestLimits: [{ scope: 'within-suite-run', limit: 1 }],
	environmentVariables: ['N8N_BASE_URL', 'RESET_E2E_DB'],
});
