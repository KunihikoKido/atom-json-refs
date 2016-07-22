'use babel';

import { CompositeDisposable } from 'atom';
import JsonRefs from 'json-refs'
import path from 'path'

export default {
  config: {
    resolveLocal: {
      title: 'Resolve Local JSON References.',
      description: '',
      type: 'boolean',
      default: true
    },
    resolveRelative: {
      title: 'Resolve Relative JSON References.',
      description: '',
      type: 'boolean',
      default: true
    },
    resolveRemote: {
      title: 'Resolve Remote JSON References.',
      description: '',
      type: 'boolean',
      default: true
    }
  },

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
    resolves = [];
    if (atom.config.get('json-refs.resolveLocal')) resolves.push('local');
    if (atom.config.get('json-refs.resolveRelative')) resolves.push('relative');
    if (atom.config.get('json-refs.resolveRemote')) resolves.push('remote');

    console.log(resolves);

    editor = atom.workspace.getActiveTextEditor();
    file = editor.getPath();

    process.chdir(path.dirname(file));
    console.log(`Working directory: ${process.cwd()}`);

    JsonRefs.resolveRefsAt('file://' + file, {filter: resolves}).then(function (res) {
      atom.workspace.open('').then(function (newEditor) {
          newEditor.setGrammar(atom.grammars.selectGrammar('untitled.json'));
          newEditor.setText(JSON.stringify(res.resolved, null, "  "));
      });

      atom.notifications.addSuccess('json-refs', {
        detail: `Success! Resolved JSON. (${file})`
      });
    }, function (error) {
      console.log(error.stack);

      atom.notifications.addError('json-refs', {
        detail: `Error! ${error.message} (${file})`
      })
    });
  }
};
