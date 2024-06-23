import asyncio
import json
async def handle_client(reader, writer):
        data = await reader.read(1024*1024)
        if not data:
            await writer.drain()
            writer.close()
            await writer.wait_closed()
            return
        
        message = data.decode()
        message = json.loads(message)
        addr = writer.get_extra_info('peername')
        print(f"Received {message} from {addr}")
        message = json.dumps(message)
        writer.write(message.encode())
        await writer.drain()
        writer.close()
        await writer.wait_closed()

async def main():
    print('server is running')
    server = await asyncio.start_server(handle_client, '127.0.0.1', 12345)
    async with server:
        await server.serve_forever()

asyncio.run(main())
