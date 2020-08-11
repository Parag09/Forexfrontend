import React , {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { blue } from '@material-ui/core/colors';

const useStyles = theme => ({
  table: {
    minWidth: 300,
    maxWIdth : 400
  },
});


class App extends Component {
  intervalID;

  state = {
    data: [],
  }



  componentDidMount() {
    document.body.style.backgroundColor = "black"
    this.getData();
  }

  componentWillUnmount() {
    clearTimeout(this.intervalID);
  }

  getData = () => {
    fetch('https://lktkd58l71.execute-api.ap-south-1.amazonaws.com/staging/forex')
      .then(response => response.json())
      .then(data => {
          data.forEach((element, i )=> {
            element.Curr = element.Curr.slice(0,3) + "/" + element.Curr.slice(3, 6) 
          });
        this.setState({ data: [...data] });
        this.intervalID = setTimeout(this.getData.bind(this), 30000);
      });


    }
  render() {
    const { classes } = this.props;
    return (

      <div className="topDiv">

 
      <img src={logo} className="App-logo" alt="logo" />
      <div className = "headerTable"> Forex Table (Table updates after every min)</div>


      <TableContainer component={Paper}>
      <Table style={{ width: 1200, margin: 'auto' , tableLayout: 'auto'}} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell > Currency Conversion (Eg : EUR to USD)</TableCell>
            <TableCell >Rate</TableCell>
            <TableCell >Timestamp</TableCell>

    
          </TableRow>
        </TableHead>
        <TableBody>
          {this.state.data.map((row) => (
            <TableRow key={row.Curr}>
              <TableCell component="th" scope="row">
                {row.Curr}
              </TableCell>
              <TableCell >{row.Rate}</TableCell>
              <TableCell >{ row.Timestamp }</TableCell>


            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    </div>

    );
  }
}


export default  withStyles(useStyles) (App);
