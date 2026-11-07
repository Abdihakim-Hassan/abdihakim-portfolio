Set WshShell = CreateObject("WScript.Shell")
WshShell.CurrentDirectory = "C:\Users\Abdibaasid\Projects\abdihakim-portfolio"

Do
  WshShell.Run "node.exe ""C:\Users\Abdibaasid\Projects\abdihakim-portfolio\always-on-server.cjs""", 0, True
  WScript.Sleep 2000
Loop
