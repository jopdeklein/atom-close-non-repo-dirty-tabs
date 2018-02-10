'use babel';
import fs from 'fs-plus'
import path from 'path'

import { CompositeDisposable } from 'atom';

export default {

  subscriptions: null,

  activate(state) {
    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'close-non-repo-tabs:close': () => this.close()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  serialize() {
  },

  close() {
    if (atom.project.getRepositories().some((repo) => repo)) {
      const paths = []
      for (const repo of atom.project.getRepositories()) {
        if (repo) {
          const workingDirectory = repo.getWorkingDirectory()
          for (let filePath in repo.statuses) {
            filePath = path.join(workingDirectory, filePath)
            if (fs.isFileSync(filePath)) {
              paths.push(filePath)
            }
          }
        }
      }

      const currentTabs = atom.workspace.getTextEditors()
      currentTabs.forEach((tab) => {
        if (!tab.buffer.file) return
        
        let tabPath = tab.buffer.file.path
        if (!paths.includes(tabPath) && !tab.buffer.isModified())// && tab !== atom.workspace.getActiveTextEditor())
          tab.destroy()
      })

    }

  }

};
