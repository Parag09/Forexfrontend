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
import AWS from "aws-sdk";
import { Consumer } from 'sqs-consumer';




const useStyles = theme => ({
  table: {
    minWidth: 300,
    maxWIdth : 400
  },
});

class App extends React.Component {
  intervalID;

  constructor(props) {
    super(props)
    this.state = {
        data: []
    }

    this.getData = this.getData.bind(this); 

}
   componentDidMount() {

    const script = document.createElement("script");
    script.src = "https://sdk.amazonaws.com/js/aws-sdk-2.734.0.min.js";
    script.async = true;
  
    document.body.appendChild(script);

    AWS.config.region = 'ap-south-1'; // Region
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'ap-south-1:9edbe760-688b-41f6-8715-5bcb57fe8357',
    });


    document.body.style.backgroundColor = "black"
     this.firstpopulate();
     this.getData();
     
  }

  componentWillUnmount() {
    clearTimeout(this.intervalID);
  }

  getData() {

    var sqs = new AWS.SQS({apiVersion: '2012-11-05'});
    var queueURL = "https://sqs.ap-south-1.amazonaws.com/563469033471/forexqueue";
    var params = {
      AttributeNames: [
         "All"
      ],
      MaxNumberOfMessages: 10,
      MessageAttributeNames: [
         "All"
      ],
      QueueUrl: queueURL,
      VisibilityTimeout: 20,
      WaitTimeSeconds: 0
     };

    
    sqs.receiveMessage(params, (err, data)=> {
       if (err) {
        console.log("Receive Error", err);

      } else if (data.Messages) {
          data.Messages.forEach((item) =>{
            let single = JSON.parse(item.Body).Message;
            let Curre =  single.slice(13,19)
            let Timestampe =  single.slice(44,59)
            let Ratee = single.slice(-11).slice(0 , -1).replace("\"","").replace(" ", "");
            const stateCopy = [...this.state.data];

            console.log(stateCopy);
            console.log(Curre, Timestampe)
            stateCopy.forEach((element , i) => {
              if(element.Curr == Curre){
                stateCopy[i] = {...stateCopy[i] , Timestamp : Timestampe}        
                stateCopy[i] = {...stateCopy[i] , Rate : Ratee}                    
            
              }});
              this.setState({data : [...stateCopy]});


          })

      }
    });
    this.intervalID = setTimeout(this.getData.bind(this), 1000);


}

  firstpopulate =() =>{
    fetch('https://lktkd58l71.execute-api.ap-south-1.amazonaws.com/staging/forex')
    .then(response => response.json())
    .then(data => {
        data.forEach((element, i )=> {
          if(element.Curr == "“ABC/DEF”"){
            data.splice(i , 1)
          }
          });
      this.setState({ data: [...data] });
    });
  }
  render() {
    const { classes } = this.props;
    return (

      <div className="topDiv">

 
      <img src={logo} className="App-logo" alt="logo" />
      <div className = "headerTable"> Forex Table (Table updates after every second)</div>


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
