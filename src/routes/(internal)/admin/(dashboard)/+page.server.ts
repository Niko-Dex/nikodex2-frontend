import os from "os"

export async function load({ cookies }) {
    return {
        frontend_nodejs_ver: process.versions.node,
        frontend_nodejs_module: process.versions.modules,
        frontend_running_for: process.uptime(),
        frontend_mem_usage: Math.round(process.memoryUsage().rss / 1024 / 1024),
        server_uptime: os.uptime(),
        server_mem_usage: Math.round((os.totalmem() - os.freemem()) / 1024 / 1024),
        server_mem_total: Math.round(os.totalmem() / 1024 / 1024)
    }
}