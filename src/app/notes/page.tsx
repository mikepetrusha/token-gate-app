'use client';
import { cookies } from 'next/headers';
import { createClient } from '../../../utils/supabase/server';
import { createNote, getNotes } from '../../../lib/actions';
import { useEffect, useState } from 'react';

export default function Notes() {
  // const cookieStore = cookies();
  // const supabase = createClient(cookieStore);
  // const { data: notes } = await supabase.from('notes').select();
  const [notes, setNotes] = useState([]);
  const handleClick = async () => {
    await createNote('Test Note 1');
    fetchNotes();
  };

  const fetchNotes = async () => {
    const notes = await getNotes();
    setNotes(notes.data);
  };
  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <>
      <pre>{JSON.stringify(notes, null, 2)}</pre>
      <button onClick={handleClick}>Create Note</button>
    </>
  );
}
