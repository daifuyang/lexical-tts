import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { COMMAND_PRIORITY_EDITOR, createCommand } from 'lexical';
import { $insertAudio } from '../nodes/audioNode';
import { useEffect } from 'react';

export const INSERT_AUDIO_COMMAND = createCommand('INSERT_AUDIO_COMMAND');

export type InsertAudioPayload = {
  text: string;
  src?: string;
};

export function AudioPlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand<InsertAudioPayload>(
      INSERT_AUDIO_COMMAND,
      (payload) => {
        const { text, src } = payload;
        $insertAudio(text, src);
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
}