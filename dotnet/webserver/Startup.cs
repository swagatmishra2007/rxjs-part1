using System;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;

namespace webserver
{
    public class Startup
    {
        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(o => o.AddPolicy("MyPolicy", builder => builder.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin()));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            app.UseCors("MyPolicy");
            app.UseWebSockets();

            app.Run(async (context) =>
            {
                if (context.Request.Method == "GET" && context.Request.Path.ToString().Contains("/api/test"))
                    await context.Response.WriteAsync("Hello World!");
                else if (context.Request.Method == "GET" && context.Request.Path.ToString().Contains("/api/redirect"))
                    context.Response.Redirect("/api/test");
                else if (context.Request.Method == "POST" && context.Request.Path.ToString().Contains("/conversations"))//start conversation
                {
                    context.Response.ContentType = "application/json";
                    await context.Response.WriteAsync(JsonConvert.SerializeObject(new Conversation()
                    {
                        conversationId = "blahblah",
                        token = "randomToken",
                        streamUrl = "ws://localhost:5000/stream"
                    }));
                }
                else if (context.Request.Method == "POST" && context.Request.Path.ToString().Contains("/tokens/refresh"))//start conversation
                {
                    context.Response.ContentType = "application/json";
                    await context.Response.WriteAsync(JsonConvert.SerializeObject(new Token()
                    {
                        token = "blahblah1"
                    }));
                }
                else if (context.Request.Method == "GET" && context.Request.Path.ToString().Contains("/stream") && context.WebSockets.IsWebSocketRequest)
                {
                    WebSocket socket = await context.WebSockets.AcceptWebSocketAsync();
                    await Echo(context, socket);
                }
                else if (context.Request.Method == "GET" && context.Request.Path.ToString().Contains("/conversations/"))
                {
                    context.Response.ContentType = "application/json";
                    await context.Response.WriteAsync(JsonConvert.SerializeObject(new Conversation()
                    {
                        conversationId = "blahblah",
                        token = "randomToken",
                        streamUrl = "ws://localhost:5000/stream"
                    }));
                }
            });
        }

        private async Task Echo(HttpContext context, WebSocket webSocket)
        {   
            var buffer = new byte[1024 * 4];
            WebSocketReceiveResult result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
            while (!result.CloseStatus.HasValue)
            {
                //await webSocket.SendAsync(new ArraySegment<byte>(buffer, 0, result.Count), result.MessageType, result.EndOfMessage, CancellationToken.None);
                await Console.Out.WriteAsync("received websocket data ");

                result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
            }
            await webSocket.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, CancellationToken.None);
        }
    }
    public class Conversation
    {
        public string conversationId { get; set;}
        public string token { get; set;}
        public string streamUrl { get; set;}
    }

    public class Token
    {
        public string token{get;set;}
    }
}
