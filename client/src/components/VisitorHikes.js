import { Container, Row, Col, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import API from '../API';
import Difficulty from '../constants/Difficulty';
import HikeCard from './HikeCard';
import { useNavigate } from "react-router-dom";


function VisitorHikes() {
    const [difficulty, setDifficulty] = useState(undefined);
    const [minLength, setMinLength] = useState(undefined);
    const [maxLength, setMaxLength] = useState(undefined);
    const [minAscent, setMinAscent] = useState(undefined);
    const [maxAscent, setMaxAscent] = useState(undefined);
    const [minTime, setMinTime] = useState(undefined);
    const [maxTime, setMaxTime] = useState(undefined);
    const [city, setCity] = useState(undefined)
    const [province, setProvince] = useState(undefined)
    const [longitude, setLongitude] = useState(undefined);
    const [latitude, setLatitude] = useState(undefined);
    const [hikes, setHikes] = useState([]);

    useEffect(() => {
        API.getVisitorHikes()
            .then(retrivedHikes => {
                setHikes(retrivedHikes);
            })
            .catch(err => console.log(err));
    }, []);

    const getVisitorHikes = async (ev) => {
        ev.preventDefault();

        // start validation
        if (minLength !== undefined && !Number.isSafeInteger(Number(minLength))) {
            return
        }
        if (maxLength !== undefined && !Number.isSafeInteger(Number(maxLength))) {
            return
        }
        if (minAscent !== undefined && !Number.isSafeInteger(Number(minAscent))) {
            return
        }
        if (maxAscent !== undefined && !Number.isSafeInteger(Number(maxAscent))) {
            return
        }
        if (minTime !== undefined && Number.isNaN(Number(minTime))) {
            return
        }
        if (maxTime !== undefined && Number.isNaN(Number(maxTime))) {
            return
        }
        if (longitude !== undefined && Number.isNaN(Number(longitude))) {
            return
        }
        if (latitude !== undefined && Number.isNaN(Number(latitude))) {
            return
        }

        const retrivedHikes = await API.getVisitorHikes(
            difficulty,
            minLength,
            maxLength,
            minAscent,
            maxAscent,
            minTime,
            maxTime,
            city,
            province,
            longitude,
            latitude
        );
        setHikes(retrivedHikes);
    }

    return (
        <Container>
            <Row>
                <Col>
                    <HikesList hikes={hikes} />
                </Col>
            </Row>
        </Container>
    );
}

function DifficultyPicker(props) {
    const { difficulty, setDifficulty } = props;

    return (
        <Dropdown className="difficulty-picker" >
            <Dropdown.Toggle variant="secondary" id="dropdown-difficulty">
                {difficulty === undefined ? 'Select difficulty' : difficulty}
            </Dropdown.Toggle>
            <Dropdown.Menu variant="dark">
                <Dropdown.Item onClick={() => setDifficulty(undefined)}>
                    Any
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setDifficulty(Difficulty.Tourist)}>
                    {Difficulty.Tourist}
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setDifficulty(Difficulty.Hiker)}>
                    {Difficulty.Hiker}
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setDifficulty(Difficulty.ProfessionalHiker)}>
                    {Difficulty.ProfessionalHiker}
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
}

function MinMaxPicker(props) {
    const { filter, setMinFilter, setMaxFilter } = props;

    return (
        <Row className='two-options-filter'>
            <Col>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>{"Min " + filter}</Form.Label>
                        <Form.Control
                            type="text"
                            onChange={(ev) => setMinFilter(ev.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Col>
            <Col>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>{"Max " + filter}</Form.Label>
                        <Form.Control
                            type="text"
                            onChange={(ev) => setMaxFilter(ev.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Col>
        </Row>
    );
}

function CoordinatesPicker(props) {
    const { setLongitude, setLatitude } = props;

    return (
        <Row className='two-options-filter'>
            <Col>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>{"Longitude "}</Form.Label>
                        <Form.Control
                            type="text"
                            onChange={(ev) => setLongitude(ev.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Col>
            <Col>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>{"Latitude "}</Form.Label>
                        <Form.Control
                            type="text"
                            onChange={(ev) => setLatitude(ev.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Col>
        </Row>
    );
}

function HikesList(props) {

    const navigator = useNavigate();

    let goToHike = (id) => {
        navigator('hiker/hikes/' + id);
    }

    return (
        <>
            {props.hikes.length === 0 ? <h3>No hikes available</h3> : undefined}
            {
                props.hikes.map((hike, index) => {
                    return (
                        <HikeCard key={hike._id} hike={hike} goToHike={goToHike} />
                    );
                })
            }
        </>
    );
}

function TextField(props) {
    const { filter, setFilter } = props;

    return (
        <Row className='basic-filter'>
            <Col>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>{filter + ": "}</Form.Label>
                        <Form.Control
                            type="text"
                            onChange={(ev) => setFilter(ev.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Col>
        </Row>
    );
}

export default VisitorHikes;