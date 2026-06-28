import discord
from discord.ext import commands

TOKEN = "MTUyMDg0MjAwNzk4MjExNjk4OA.G_v6IP.ykdkLpO9thJk8W0n-X7UeSipEx7abBUhYBP00k"

intents = discord.Intents.default()
intents.message_content = True

bot = commands.Bot(command_prefix="!", intents=intents)

@bot.event
async def on_ready():
    print(f"ล็อกอินเป็น {bot.user}")

@bot.command()
async def ping(ctx):
    await ctx.send("Pong!")

bot.run(TOKEN)
