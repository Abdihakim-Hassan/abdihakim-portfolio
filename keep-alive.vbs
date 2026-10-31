Set WshShell = CreateObject("WScript.Shell")
WshShell.CurrentDirectory = "C:\Users\Abdibaasid\.gemini\antigravity\scratch\abdihakim-portfolio"

Do
  WshShell.Run "node.exe ""C:\Users\Abdibaasid\.gemini\antigravity\scratch\abdihakim-portfolio\always-on-server.cjs""", 0, True
  WScript.Sleep 2000
Loop
