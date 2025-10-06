import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { okaidia } from '@uiw/codemirror-theme-okaidia';

const languageExtensions = {
  javascript: [javascript({ jsx: true })],
  python: [python()],
  cpp: [cpp()],
  java: [java()],
};

const Editor = ({ value, onChange, language }) => {
  return (
    <CodeMirror
      value={value}
      height="100%"
      theme={okaidia}
      extensions={languageExtensions[language]}
      onChange={onChange}
      style={{ height: '100%' }}
    />
  );
};

export default Editor;

