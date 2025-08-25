import type { Handle } from "@sveltejs/kit"
import chalk, { type ChalkInstance } from "chalk"

export const handle: Handle = async ({ event, resolve }) => {
    const method = event.request.method;
	const url = event.url.pathname + event.url.search;

    // Process request & capture response
    const start = Date.now()
    const response = await resolve(event);
    const duration = Date.now() - start

    const status = response.status
    let statusColor: ChalkInstance = chalk.white

    if (status >= 500) statusColor = chalk.red;
	else if (status >= 400) statusColor = chalk.yellow;
	else if (status >= 300) statusColor = chalk.cyan;
	else if (status >= 200) statusColor = chalk.green;

    let durationColor: ChalkInstance = chalk.greenBright
    if (duration >= 1000) durationColor = chalk.yellowBright

    let methodColor: ChalkInstance = chalk.cyan
    switch (method) {
        case "GET":
            methodColor = chalk.cyan
            break
        case "POST":
            methodColor = chalk.green
            break
        case "PUT":
            methodColor = chalk.yellow
            break
        case "PATCH":
            methodColor = chalk.magenta
            break
        case "DELETE":
            methodColor = chalk.red
            break
    }

	console.log(
		`[${new Date().toISOString()} | ${durationColor(duration.toString().padStart(3, ' ') + "ms")}] (${statusColor(response.status)}) ${methodColor(method)} ${chalk.blueBright(url)}`
	);

    return response
}