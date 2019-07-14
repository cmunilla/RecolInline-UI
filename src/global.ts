import * as process from 'process';
import * as buffer from 'safe-buffer';
import * as browserify from 'stream-browserify';

window['process'] = process;
window['global'] = window['global']  || window;
window['global']['Buffer']= window['global']['Buffer']  || buffer.Buffer;
