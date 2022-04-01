'use babel';
'use text-editor';

import LineCommandsView from './line-commands-view';
import { CompositeDisposable, TextEditor } from 'atom';
import CustomParseCommands from './customparsecommands';
import * as com from './commands';
export default {

  lineCommandsView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.lineCommandsView = new LineCommandsView(state.lineCommandsViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.lineCommandsView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that runs this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'line-commands:run': () => this.run()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.lineCommandsView.destroy();
  },

  serialize() {
    return {
      lineCommandsViewState: this.lineCommandsView.serialize()
    };
  },

  run() {
    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      //get row number where cursor is
      let lineNum = editor.getCursorBufferPosition().row
      //get line string at line where cursor is
      let line = editor.lineTextForBufferRow(lineNum)
      //delete row containing command
      editor.deleteLine()
      //create instance of CustomParseCommands to parse commands
      let parseCommands = new CustomParseCommands(line)

      let command = parseCommands.getCommand()
      let argList = parseCommands.getArgList()

      let aL = argList.length
      //get buffer object from editor
      let buffer = editor.getBuffer()
      //determine which command was specified
      if (command == "replaceall" || command == "replace") {
        if (aL == 0) {
          return
        }
        com.replaceall(buffer, argList)
        //buffer.scan(new RegExp(argList[0], 'g'), function(obj) { obj.replace(argList[1])} )
      }
      else if(command == "copy"){
        com.copylines(editor, buffer, argList)
      }
      else if (command == "replaceone") {
        if (aL == 0) {
          return
        }
        com.replaceone(buffer, argList)
        //buffer.scan(new RegExp(argList[0]), function(obj) { obj.replace(argList[1])} )
      }
      else if (command == "goto") {
        if (aL == -1) {
        //console.out(aL)
          return
        }
        com.goto(editor,argList)
      }
      else if (command == "delete") {
        com.del(buffer, argList)
      } //if an invalid command was specified, do nothing
      else { return }
    }
  }
};
