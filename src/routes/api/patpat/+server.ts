import { env } from "$env/dynamic/private"
import GIFEncoder from "gif-encoder"
import { handFrames, frameOffsets, handHeight, handWidth, globalOffset } from "./hand"
import { createCanvas, loadImage } from 'canvas';
import { errSrv } from '../helper';

export async function GET({ request, fetch, cookies }) {
    try {
        const url = new URL(request.url)
        const res = await fetch(`${env.API_SERVER_URL}/image?id=${url.searchParams.get("id")}`)

        if (res.status != 200) return res

        const ogImage = await loadImage(Buffer.from(await res.arrayBuffer()))

        const gifMaker = new GIFEncoder(handWidth, handHeight)
        const canvas = createCanvas(handWidth, handHeight)
        const ctx = canvas.getContext("2d")
        const handImg = await loadImage(handFrames)

        gifMaker.setFrameRate(25)
        // i realized that servers suck and cant handle this
        gifMaker.setRepeat(0)

        gifMaker.writeHeader()
        for (let offset of frameOffsets) {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(ogImage, globalOffset.x + offset.x, globalOffset.y + offset.y, handWidth - globalOffset.x + offset.w, handHeight - globalOffset.y + offset.h)
            ctx.drawImage(handImg, offset.f * handWidth, 0, handWidth, handHeight, 0, 0, handWidth, handHeight)
            gifMaker.addFrame(ctx.getImageData(0, 0, handWidth, handHeight).data)
        }

        gifMaker.finish()

        const buffer = gifMaker.read() as Buffer<ArrayBuffer> | null
        if (buffer) {
            return new Response(buffer, {
                headers: {
                    "Content-Type": "image/gif",
                    "Content-Length": buffer.length.toString()
                }
            })
        }
    } catch (e) {
        return errSrv(e)
    }
}