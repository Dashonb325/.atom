'use babel';

import { CompositeDisposable } from 'atom';

export default {

  subscriptions: null,

  activate(state) {

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'npm-start:npmStart': () => this.npmStart()
    }));
  },

  npmStart() {
    // Get root path from current edited file
    var editor = atom.workspace.getActiveTextEditor();
    var editorPath = atom.project.relativizePath(editor.getPath())[0]
    console.log("editorPath variable: " + editorPath);

    // Execute cmd commands
    var exec = require('child_process').exec, child;
    child = exec('start cmd /k npm start --prefix ' + editorPath,
        function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
                 console.log('exec error: ' + error);
            }
        });
  }

};
