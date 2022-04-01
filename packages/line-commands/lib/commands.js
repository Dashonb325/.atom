'use babel';
/*
* Matthew Guidry 2018
* Nam Vu 2018
* file defines line commands
*/
import { CompositeDisposable, Point, TextEditor } from 'atom';
/* This function takes 2 arguments as range and copy texts in range
* @param argList[0] = source
* @param argList[1] = destination
*/
export function copylines(editor, buffer, argList){
  if (argList.length != 2) {
    return
  }
  if(argList[0]>argList[1]){
    return
  }
  var tmp = editor.lineTextForBufferRow(Number(argList[1])-1)
  var src = [Number(argList[0])-1,0]
  var des = [Number(argList[1])-1,tmp.length]
  console.log(des)
  editor.setCursorScreenPosition(src)
  editor.addSelectionForBufferRange([src,des])
  editor.copySelectedText()
}
/*
* replace all function difference is 'g' argument in regex
*/
export function replaceall(buffer, argList) {
  buffer.scan(new RegExp(argList[0], 'g'), function(obj) { obj.replace(argList[1])} )
}
//replace one function replaces the first found instance of a string
export function replaceone(buffer, argList) {
  buffer.scan(new RegExp(argList[0]), function(obj) { obj.replace(argList[1])} )
}
/* This function jumps the cursor to the given line */
export function goto(editor, argList) {
  //line to goto
  const lineNumber = argList[0]
  // if line out of range, do nothing
  if (!editor || !lineNumber.length) return
  //line checking
  const currentRow = editor.getCursorBufferPosition().row
  const rowLineNumber = lineNumber.split(/:+/)[0] || ''
  const row = rowLineNumber.length > 0 ? parseInt(rowLineNumber) - 1 : currentRow
  const columnLineNumber = lineNumber.split(/:+/)[2] || ''
  const column = columnLineNumber.length > 0 ? parseInt(columnLineNumber) - 2 : -2
  //create point based on line row
  const position = new Point(row, column)
  //set new position
  editor.setCursorBufferPosition(position)
  editor.unfoldBufferRow(row)
  if (column < 0) {
    editor.moveToFirstCharacterOfLine()
  }
  //move screen to center around cursor
  editor.scrollToBufferPosition(position, {
    center: true
  })
}
//function to delete line or range of lines
export function del(buffer, argList) {
  //console.log(argList.length)
  //if no lines specified, do nothing
  if (argList[0]<0) {
    return
  }
  // delete 1 row
  if (argList.length == 1) {
    buffer.deleteRow(argList[0]-1)
  } //delete range of lines
  else if (argList.length >1) {
    if (argList[1] < 0 || argList[0] > argList[1]) {
      return
    }
    buffer.deleteRows(argList[0]-1, argList[1]-1)
  }
}
