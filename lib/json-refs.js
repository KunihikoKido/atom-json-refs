'use babel';

import { CompositeDisposable } from 'atom';
import JsonRefs from 'json-refs'
import path from 'path'

export default {

  subscriptions: null,

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'json-refs:resolve': () => this.resolve()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  resolve() {
    editor = atom.workspace.getActiveTextEditor();
    text = editor.getText();
    file = editor.getPath();

    process.chdir(path.dirname(file));
    console.log(`Working directory: ${process.cwd()}`);

    JsonRefs.resolveRefsAt('file://' + file, {}).then(function (res) {
      atom.workspace.open('').then(function (newEditor) {
          newEditor.setGrammar(atom.grammars.selectGrammar('untitled.json'));
          newEditor.setText(JSON.stringify(res.resolved, null, "  "));
      });
    }, function (error) {
      console.log(error.stack);
    });
  }

};
