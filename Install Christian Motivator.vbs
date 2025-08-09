Set shell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
scriptPath = WScript.ScriptFullName
scriptDir = fso.GetParentFolderName(scriptPath)
shell.CurrentDirectory = scriptDir
bat = Chr(34) & scriptDir & "\\MakeInstaller.bat" & Chr(34)
rc = shell.Run(bat, 0, True)
If rc <> 0 Then
  MsgBox "Installer builder failed. Please extract the ZIP to a folder and run again or run MakeInstaller.bat manually.", 16, "Christian Motivator"
Else
  MsgBox "Build complete. The setup has been launched (or is in the 'release' folder).", 64, "Christian Motivator"
End If
