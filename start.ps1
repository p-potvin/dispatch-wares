# 1. Create Folder Structure
$dirs = @(
    "backend/src/services", "backend/src/middleware", "backend/src/utils", "backend/prisma",
    "frontend/src/api", "frontend/src/components", "frontend/src/logic", "frontend/src/pages"
)
foreach ($dir in $dirs) { New-Item -ItemType Directory -Force -Path $dir }

# 2. Write the Trace Middleware
@"
import { v4 as uuidv4 } from 'uuid';
import { AsyncLocalStorage } from 'async_hooks';

export const requestIdStore = new AsyncLocalStorage();

export const traceMiddleware = (req, res, next) => {
    const id = req.headers['x-correlation-id'] || uuidv4();
    res.setHeader('X-Correlation-ID', id);
    requestIdStore.run(id, () => next());
};
"@ | Out-File -FilePath "backend/src/middleware/trace.js"

# 3. Write the Redaction Utility
@"
export const redactPII = (data) => {
    if (!data) return data;
    const cloned = JSON.parse(JSON.stringify(data));
    const mask = (str) => str?.replace(/^\d+/, '***');
    if (cloned.destAddress) cloned.destAddress = mask(cloned.destAddress);
    return cloned;
};
"@ | Out-File -FilePath "backend/src/utils/privacy.js"

Write-Host "✅ Source files generated in dispatch-wares!" -ForegroundColor Cyan