import { eventBus } from '@/lib/server/eventBus';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      const send = (data: string) => controller.enqueue(encoder.encode(data));

      const onUpdate = () => {
        send(`data: updated\n\n`);
      };

      const keepAlive = setInterval(() => {
        send(`event: ping\ndata: ${Date.now()}\n\n`);
      }, 20000);

      eventBus.on('events-updated', onUpdate);

      const close = () => {
        clearInterval(keepAlive);
        eventBus.off('events-updated', onUpdate);
        controller.close();
      };

      request.signal.addEventListener('abort', close);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
