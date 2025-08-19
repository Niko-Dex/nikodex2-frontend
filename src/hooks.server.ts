import type { Handle } from "@sveltejs/kit"
import chalk, { type ChalkInstance } from "chalk"

export const handle: Handle = async ({ event, resolve }) => {
    const method = event.request.method;
	const url = event.url.href;
	const ip =
		event.getClientAddress?.() ??
		event.request.headers.get('x-forwarded-for') ??
		'unknown';

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

	console.log(
		`[${new Date().toISOString()} | ${chalk.greenBright(duration + "ms")}] (${statusColor(response.status)}) ${chalk.cyan(method)} ${chalk.blueBright(url)} from ${ip}`
	);

    return response
}