/* neDB */



import Datastore from 'nedb-promise'
import path from 'path'
import { remote } from 'electron'

export default new Datastore({
  autoload: true,
  filename: path.join(remote.app.getPath('userData'), '/data.db')
})


//console.log(remote.app.getPath('userData'))
