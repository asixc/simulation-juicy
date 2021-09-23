import { useState } from 'react';
import './App.css';
import { DatePicker, message, InputNumber, Button, Divider, Empty, Table, Typography} from 'antd';
import 'antd/dist/antd.css';
import dayjs from 'dayjs';
const COLUMNS = [
  {
    title: 'Fecha de compra',
    dataIndex: 'dateBuy',
    key: 'dateBuy',
  },
  {
    title: 'Fecha plantada',
    dataIndex: 'datePlanted',
    key: 'datePlanted',
  },
  {
    title: 'Fecha de venta',
    dataIndex: 'dateSale',
    key: 'dateSale',
  },
  {
    title: 'Número de plantas',
    dataIndex: 'nPlants',
    key: 'nPlants',
  },
  {
    title: 'Min (46g)',
    dataIndex: 'min',
    key: 'min',
  },
  {
    title: 'Med (48g)',
    dataIndex: 'med',
    key: 'med',
  },
  {
    title: 'Max (49g)',
    dataIndex: 'max',
    key: 'max',
  },
]
const App = () => {
  const [elements, setElements] = useState([]);
  const [nPlants, setNplants] = useState(0);
  const [date, setDate] = useState(null);

  const handleDateChange = value => {
    //message.info(`Selected Date: ${value ? value.format('YYYY-MM-DD') : 'None'}`);
    setDate(value);
  
  };
  const handleNumberChange = value => {
    //message.info(`Selected Date: ${value ? value.format('YYYY-MM-DD') : 'None'}`);
    setNplants(value);
  
  };
  const getNextPlantedDay  = (datePlant) => {
    let currentDate = datePlant.toDate();
    
    while (currentDate.getDay() !== 1 && currentDate.getDay() !== 5){
      currentDate.setDate(currentDate.getDate() +1 );
    }

    return currentDate;
  };
  const addPlant = () => {
    if ( date && nPlants ){
      const newPlant = {
        date:date, nPlants:nPlants
      }
      setElements([...elements,newPlant]);
      return message.info(`Selected Date: ${date ? date.format('YYYY-MM-DD') : 'None'}  \n
                Number of Plants: ${nPlants ? nPlants : 'None'}`);
    }
    return message.error(`insuficcient data`);
   
  };

  const getList = (e) =>  {
    return (
      <>
     {/* <Table dataSource={dataSource} columns={columns} />;*/}
       Selected Date: {e.date ? e.date.format('YYYY-MM-DD') : 'None'}
    <Divider type={"vertical"} />
    Number of plants: {e.nPlants}
    <Divider type={"vertical"} />
    Minimu expectation: {e.nPlants * 47 * 1.5}
    <Divider type={"vertical"} />
    Medium expectation:
    <Divider type={"vertical"} />
    </>
    )
  }
  const getTable = (rows) =>  {
    const { Text } = Typography;
    const data = [];
    
    rows.forEach((r, i) => {
      let datePlanted =  dayjs(getNextPlantedDay(r.date));
      data.push({
        key: i,
        dateBuy: r.date.format('DD-MM-YYYY'),
        nPlants: r.nPlants,
        datePlanted: datePlanted.format('DD-MM-YYYY'),
        dateSale: datePlanted.add(108, 'day').format('DD-MM-YYYY') ,
        min: nPlants*46*1.5 ,
        med: nPlants*48*1.5 ,
        max: nPlants*49*1.5 
      });
    })
    const simulation= [];
    for(let i = 0; i<3 ; i++){
      console.log('->', simulation)
      if (i === 0 ){
        console.log('if :', i)
        let ini = [...data]; //data.slice();
        simulation.push(
        <Table key={i} dataSource={ini} columns={COLUMNS} summary={pageData => {
          let totalMin = 0;
          let totalMed = 0;
          let totalMax = 0;
    
          pageData.forEach(({ min, med, max }) => {
            totalMin += min;
            totalMed += med;
            totalMax += max;
          });
    
          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell colSpan={4}>Total</Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Text type="danger">{totalMin}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Text>{totalMed}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Text>{totalMax}</Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          );
        }} />)
      } else {
        console.log('else :', i)
        //let val = [...data];// data.slice();
        
        data.forEach((d) => {
          /*
          let datePlanted =  dayjs(getNextPlantedDay(r.date));
          data.push({
            key: i,
            dateBuy: r.date.format('DD-MM-YYYY'),
            nPlants: r.nPlants,
            datePlanted: datePlanted.format('DD-MM-YYYY'),
            dateSale: datePlanted.add(108, 'day').format('DD-MM-YYYY') ,
            min: nPlants*46*1.5 ,
            med: nPlants*48*1.5 ,
            max: nPlants*49*1.5 
          });
          
         */
         d.min =d.nPlants*46+1000;
          //console.log(d.dateBuy ='aaa')
        })

        simulation.push(
          <Table key={i} dataSource={data} columns={COLUMNS} summary={pageData => {
            let totalMin = 0;
            let totalMed = 0;
            let totalMax = 0;
      
            pageData.forEach(({ min, med, max }) => {
              totalMin += min;
              totalMed += med;
              totalMax += max;
            });
      
            return (
              <>
                <Table.Summary.Row>
                  <Table.Summary.Cell colSpan={4}>Total</Table.Summary.Cell>
                  <Table.Summary.Cell>
                    <Text type="danger">{totalMin}</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell>
                    <Text>{totalMed}</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell>
                    <Text>{totalMax}</Text>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </>
            );
          }} />)
      }
      
    }
    
    return simulation;
  }
 
  return (
    <div style={{ width: 800, margin: '100px auto' }}>
      <InputNumber onChange={handleNumberChange}/>
      <DatePicker onChange={handleDateChange} />
      <Button onClick={addPlant} disabled={!nPlants || !date}>
        Añadir compra
      </Button>
      <Divider>Resultados generales</Divider>
      {
        elements.length 
        ?  (
        <div style={{ marginTop: 16 }}>
             {getTable(elements)}
        </div> )
        : <Empty></Empty>
      }
      {/* <div style={{ marginTop: 16 }}>
        Selected Date: {date ? date.format('YYYY-MM-DD') : 'None'}
      </div> */}

    </div>
  );
};

export default App;
