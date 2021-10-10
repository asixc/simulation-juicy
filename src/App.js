import { useState } from "react";
import "./App.css";
import {
  DatePicker,
  message,
  InputNumber,
  Button,
  Divider,
  Empty,
  Table,
  Typography,
  Slider,
  Row, 
  Col,
  Input
} from "antd";
import "antd/dist/antd.css";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";
import { v4 as uuidv4 } from 'uuid';

const PERIOD_OF_DAYS = 90;
const { Text } = Typography;
const COLUMNS = [
  {
    title: "Fecha de compra",
    dataIndex: "dateBuy",
    key: "dateBuy",
  },
  {
    title: "Fecha plantada",
    dataIndex: "datePlanted",
    key: "datePlanted",
  },
  {
    title: "Fecha de venta",
    dataIndex: "dateSale",
    key: "dateSale",
  },
  {
    title: "Número de plantas",
    dataIndex: "nPlants",
    key: "nPlants",
  },
  {
    title: "Min (46g)",
    dataIndex: "min",
    key: "min",
  },
  {
    title: "Med (48g)",
    dataIndex: "med",
    key: "med",
  },
  {
    title: "Max (49g)",
    dataIndex: "max",
    key: "max",
  },
  {
    title: "Equivalencia de plantas",
    dataIndex: "eqNPlants",
    key: "eqNPlants",
  },
];
const marks = {
  45: '45g',
  55: {
    style: {
      color: '#f50',
    },
    label: <strong>55g</strong>,
  },
};
const App = () => {
  const [elements, setElements] = useState([]);
  const [nPlants, setNplants] = useState(0);
  const [expectedHarvest, setExpectedHarvest] = useState(47);
  const [numberSimulations, setNumberOfSimulations] = useState(7);
  const [date, setDate] = useState(null);
  const formatter = (value) => {
    return `${value}g`;
  }
  const handleNumberSimulationsChange = (value) => {
    //message.info(`Selected Date: ${value ? value.format('YYYY-MM-DD') : 'None'}`);
    setNumberOfSimulations(value);
  };
  const handleExpectedHarvest = (value) => {
    //message.info(`Selected Date: ${value ? value.format('YYYY-MM-DD') : 'None'}`);
    setExpectedHarvest(value);
  };
  const handleDateChange = (value) => {
    //message.info(`Selected Date: ${value ? value.format('YYYY-MM-DD') : 'None'}`);
    setDate(value);
  };
  const handleNumberChange = (value) => {
    //message.info(`Selected Date: ${value ? value.format('YYYY-MM-DD') : 'None'}`);
    setNplants(value);
  };
  const getNextPlantedDay = (datePlant) => {
    let currentDate = datePlant.toDate();
    while (currentDate.getDay() !== 1 && currentDate.getDay() !== 5) {
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return currentDate;
  };
  const addPlant = () => {
    if (date && nPlants) {
      const newPlant = {
        date: date,
        nPlants: nPlants,
      };
      setElements([...elements, newPlant]);
      return message.info(`Selected Date: ${
        date ? date.format("YYYY-MM-DD") : "None"
      }  \n
                Number of Plants: ${nPlants ? nPlants : "None"}`);
    }
    return message.error(`insuficcient data`);
  };
/*
  const getList = (e) => {
    return (
      <>
        { <Table dataSource={dataSource} columns={columns} />;}
        Selected Date: {e.date ? e.date.format("YYYY-MM-DD") : "None"}
        <Divider type={"vertical"} />
        Number of plants: {e.nPlants}
        <Divider type={"vertical"} />
        Minimu expectation: {e.nPlants * 47 * 1.5}
        <Divider type={"vertical"} />
        Medium expectation:
        <Divider type={"vertical"} />
      </>
    );
  };
  */
  const getTable = (rows) => {
    //const { Text } = Typography;
    let data = [];
    rows.forEach((r, i) => {
      let datePlanted = dayjs(getNextPlantedDay(r.date));
      
      let npPlant = r.nPlants;
          for (let e = 1; e <= 1; e++) {
            npPlant = Math.trunc((npPlant * expectedHarvest * 1.5) / 50);
          }
      data.push({
        key: uuidv4(),
        dateBuy: r.date.format("DD-MM-YYYY"),
        nPlants: r.nPlants,
        eqNPlants: npPlant,
        datePlanted: datePlanted.format("DD-MM-YYYY"),
        dateSale: datePlanted.add(PERIOD_OF_DAYS, "day").format("DD-MM-YYYY"),
        min: r.nPlants * 46 * 1.5,
        med: r.nPlants * 48 * 1.5,
        max: r.nPlants * 49 * 1.5,
      });
    });
    const simulation = [];

    for (let i = 0; i < numberSimulations; i++) {
      if (i === 0) {
        simulation.push(
          <Table
            key={uuidv4()}
            dataSource={data}
            columns={COLUMNS}
            summary={(pageData) => {
              let totalMin = 0;
              let totalMed = 0;
              let totalMax = 0;
              let totalPlants = 0;
              let totalNextPlants = 0;

              pageData.forEach(({ min, med, max, nPlants, eqNPlants}) => {
                totalMin += min;
                totalMed += med;
                totalMax += max;
                totalPlants += nPlants;
                totalNextPlants += eqNPlants;
              });

              return (
                <>
                  <Table.Summary.Row>
                    <Table.Summary.Cell colSpan={3}>Total</Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text style={{color:'#52c41a'}}>{totalPlants}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text style={{color:'#8c8c8c'}} type="danger">{totalMin}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text style={{color:'#595959'}}>{totalMed}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text style={{color:'#434343'}}>{totalMax}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text style={{color:'#434343'}}>{totalNextPlants}</Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </>
              );
            }}
          />
        );
      } else {
      //let val = [...data]; // data.slice();

        let a = data.map((r) => {
          dayjs.extend(customParseFormat);
          //console.log('---', dayjs(r.datePlanted, "DD-MM-YYYY"));
          let datePlanted = dayjs(r.datePlanted, "DD-MM-YYYY").add(
            PERIOD_OF_DAYS * i,
            "day"
          ); //dayjs(r.datePlanted.toDate(), "DD-MM-YYYY");
          datePlanted.add(2, "day");
          let np = r.nPlants;
          for (let e = 1; e <= i; e++) {
            np = Math.trunc((np * expectedHarvest * 1.5) / 50);
          }
          let npPlant = r.nPlants;
          for (let e = 0; e <= i; e++) {
            npPlant = Math.trunc((npPlant * expectedHarvest * 1.5) / 50);
          }
          return {
            key: uuidv4(),
            dateBuy: dayjs(getNextPlantedDay(datePlanted)).format("DD-MM-YYYY"),
            nPlants: np,
            eqNPlants: npPlant,
            datePlanted: dayjs(getNextPlantedDay(datePlanted)).format(
              "DD-MM-YYYY"
            ),
            dateSale: datePlanted.add(PERIOD_OF_DAYS, "day").format("DD-MMMM-YYYY"),
            min: np * 46 * 1.5,
            med: np * 48 * 1.5,
            max: np * 49 * 1.5,
          };
        });
       
        simulation.push(
          <Table
            key={uuidv4()}
            dataSource={a}
            columns={COLUMNS}
            summary={(pageData) => {
              let totalMin = 0;
              let totalMed = 0;
              let totalMax = 0;
              let totalPlants = 0;
              let totalNextPlants = 0;

              pageData.forEach(({ min, med, max, nPlants, eqNPlants }) => {
                totalMin += min;
                totalMed += med;
                totalMax += max;
                totalPlants += nPlants;
                totalNextPlants += eqNPlants;
              });

              return (
                <>
                  <Table.Summary.Row>
                    <Table.Summary.Cell colSpan={3}>Total</Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text style={{color:'#52c41a'}}>{totalPlants}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text style={{color:'#8c8c8c'}} type="danger">{totalMin}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text style={{color:'#595959'}}>{totalMed}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text style={{color:'#434343'}}>{totalMax}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text style={{color:'#434343'}}>{totalNextPlants}</Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </>
              );
            }}
          />
        );
      }
    }
    return simulation;
  };

  return (
    <div style={{ width: 800, margin: "100px auto" }}>
      <Row>
        <Col flex={9}>
          <InputNumber min={1} onChange={handleNumberChange} />
          <DatePicker onChange={handleDateChange} />
          <Button onClick={addPlant} disabled={!nPlants || !date}>
            Añadir compra
          </Button>
        </Col>
        <Col flex={4}>
          <Text type="secondary" level="h1">JuicyFlash</Text>    
        </Col>
        <Col flex={9}>
          <Input suffix="grams" type="text" style={{width: 100 }} value={expectedHarvest} disabled />
          {/* <Input prefix="Number of simulations:" type="number" style={{width: 250 }}  defaultValue={numberSimulations} min={1} onChange={handleNumberSimulationsChange}/> */}
          <Slider defaultValue={[47]} min={45} max={55} onChange={handleExpectedHarvest} tipFormatter={formatter} marks={marks}/>
          
        </Col>
          
      </Row>
      <Divider>Resultados generales</Divider>
      {elements.length ? (
        <div style={{ marginTop: 16 }}>
          {getTable(elements)}
          {/*<simulation props={elements} /> */}
        </div>
      ) : (
        <Empty></Empty>
      )}
      {/* <div style={{ marginTop: 16 }}>
        Selected Date: {date ? date.format('YYYY-MM-DD') : 'None'}
      </div> */}
    </div>
  );
};

export default App;
