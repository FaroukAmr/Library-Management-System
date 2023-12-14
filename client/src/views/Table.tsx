import '../styles/shared.css';

import TableCell, { tableCellClasses } from '@mui/material/TableCell';

import { Book } from '../models/Book';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(() => ({
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

interface Props {
  data: any[];
  headers: string[];
  redirectTo: string;
  hasDate?: boolean;
}

export default function BooksTable({
  data,
  headers,
  redirectTo,
  hasDate,
}: Props) {
  const navigate = useNavigate();
  const handleClick = (id: string) => {
    navigate(redirectTo + '/' + id);
  };

  for (let i = 0; i < headers.length; i++) {
    if (headers[i].includes('date')) {
      data.forEach((row) => {
        row[headers[i].replace(/ /g, '_')] = new Date(
          row[headers[i].replace(/ /g, '_')]
        ).toLocaleDateString();
      });
    }
  }
  const isDateExceeded = (index: number): boolean => {
    if (hasDate) {
      const borrowedDate = new Date(data[index].borrowed_date);
      const expectedReturnDate = new Date(data[index].expected_return_date);
      return borrowedDate > expectedReturnDate;
    }
    return false;
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            {headers.map((header, i) => (
              <StyledTableCell key={i} align={i == 0 ? 'left' : 'right'}>
                {header.toUpperCase()}
              </StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, i) => (
            <StyledTableRow
              onClick={() => {
                handleClick(row.isbn);
              }}
              className="table-row"
              key={row.isbn}
              style={{ background: isDateExceeded(i) ? '#c00000' : '#f5f5f5' }}
            >
              {headers.map((header, i) => {
                if (i == 0) {
                  return (
                    <StyledTableCell key={i} component="th" scope="row">
                      {row[header.replace(/ /g, '_') as keyof Book]}
                    </StyledTableCell>
                  );
                } else {
                  return (
                    <StyledTableCell key={i} align="right">
                      {row[header.replace(/ /g, '_') as keyof Book]}
                    </StyledTableCell>
                  );
                }
              })}
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
