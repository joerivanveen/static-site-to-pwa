
Const ForReading = 1, ForWriting = 2
Dim fso, args, ws, webfolder, path_to_pwa, cache_trigger_files, cache_folders, length

'folders containing any of these files will be added to the cache, as well as parent folders
'for parent folders goes: they are entirely added to cache, except any of the above folders.
Set fso = CreateObject("Scripting.FileSystemObject")
Set ws     = CreateObject("WScript.Shell")
Set args   = WScript.Arguments
Set cache_folders = CreateObject("Scripting.Dictionary")
Set cache_trigger_files = CreateObject("Scripting.Dictionary")
cache_trigger_files.CompareMode = 1 'vbTextCompare
'list the files that can be the index doc of a folder that needs indexing, earlier mentioned take precedence over later ones
cache_trigger_files.Add "cache_this_folder.txt", true
cache_trigger_files.Add "ditiseenhandleiding.txt", true

'Script will only run when website folder is dropped with a "pwa" folder in it
If args.Count = 1 Then
	On Error Resume Next
	Err.Clear
	Set webfolder = fso.GetFolder(args(0))
	If Err Then
		ws.Popup "Drag-and-drop a folder containing your website onto this script.",  , Title, 48
		Cleanup()
	End If
	
	path_to_pwa = webfolder.Path & "\pwa"
	If (Not fso.folderExists(path_to_pwa)) Then
		ws.Popup "Website should contain a folder pwa or it won't work.",  , Title, 48
		Cleanup()
	End If

	On Error Goto 0
	'gather the folders
	gatherFolders(webfolder)
	
	'create a file containing the assets that will be included by the serviceworker
	Dim objStream
	Set objStream = CreateObject("ADODB.Stream")
	objStream.CharSet = "utf-8"
	objStream.Open
	objStream.WriteText "const ruigehond_pwa_assets = {"
	objStream.WriteText vbCrLf
	for each item in cache_folders.Keys
		if fso.folderExists(item) then
			objStream.WriteText "'"
			objStream.WriteText Replace(Replace(item, webfolder.Path, ""),"\","/")
			objStream.WriteText "':{destination:"
			if cache_folders(item) <> "" then
        		objStream.WriteText "'"
				objStream.WriteText cache_folders(item)
        		objStream.WriteText "'"
			else
				objStream.WriteText "null"
			end if
			objStream.WriteText ",assets:["
			objStream.WriteText vbCrLf
			writePathsToCacheForFolder(fso.getFolder(item))
			objStream.WriteText "]},"
			objStream.WriteText vbCrLf
		end if
	next
	' write the base cache by hand, you only need the pwa stuff
	objStream.WriteText "'/':{destination:null,assets:["
    objStream.WriteText "'serviceworker.js',"
    objStream.WriteText vbCrLf
    for each folder in webfolder.subfolders
        if folder.Name = "pwa" then
            writePathsToCacheForFolder(folder)
        end if
    next
    objStream.WriteText "]}}"
	objStream.WriteText vbCrLf
	objStream.SaveToFile path_to_pwa & "\assets.js", 2
	objStream.Close
	ws.Popup("Done writing cache info to " & path_to_pwa & "\assets.js")
	Cleanup()


'*****************************************************************************************
'loop
Sub gatherFolders(parent)
	Dim path, destination
	for each f in parent.Files
		if cache_trigger_files.Exists(f.Name) then
			path = parent.Path
			index_doc = f.Name
		    'get the first one if applicable
		    for each file_name in cache_trigger_files
		        if fso.fileExists(path & "\" & file_name) then
		            index_doc = file_name
		            Exit for
		        end if
		    next
			do until path = webfolder.Path
				if cache_folders.Exists(path) then exit do
				cache_folders.Add path, index_doc
				index_doc = ""
				length = InStrRev(path, "\", Len(path), 1) - 1
				path = Left(path, length)
			loop
			exit for
		end if
	next
	for each f in parent.subfolders
		gatherFolders(f)
	next
End Sub

Sub writePathsToCacheForFolder(parent)
	for each f in parent.Files
		objStream.WriteText "'"
		objStream.WriteText Replace(Replace(f.Path, webfolder.Path, ""),"\","/")
		objStream.WriteText "',"
		objStream.WriteText vbCrLf
	next
	for each f in parent.subfolders
		if not cache_folders.Exists(f.Path) then
			writePathsToCacheForFolder(f)
		end if
	next
End Sub


ws.Popup("Done!")
Cleanup()
'*****************************************************************************************


Else 'not exactly 1 argument is received
  ws.Popup "Use Drag-and-Drop to drop one folder onto this script.", , Title, 48
  Cleanup()
End If



Sub Cleanup()
	On Error Resume Next
	Set args = Nothing
	Set fso  = Nothing
	Set ws   = Nothing
	Set f = nothing
	set raw = nothing
	set raw1 = nothing
	set raw2 = nothing
	set selectie = nothing
	WScript.Quit
End Sub

