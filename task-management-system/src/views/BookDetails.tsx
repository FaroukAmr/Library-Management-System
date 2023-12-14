import { useEffect, useState } from 'react';

import React from 'react';
import SnackBar from './Snackbar';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export const BookDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  useEffect(() => {
    axios
      .get('/api/books/' + id)
      .then((response) => {
        console.log(response);

        if (response.data.length === 0) {
          setMessage('Book not found');
          setOpen(true);
        }
      })
      .catch((error) => {
        setMessage(error.response.data.errors[0].msg);
        setOpen(true);
      });
  }, []);

  return (
    <div>
      BookDetails {id}
      <SnackBar
        open={open}
        setOpen={setOpen}
        severity={'error'}
        message={message}
      />
    </div>
  );
};
