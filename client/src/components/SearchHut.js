import React, { useState, useRef, useEffect } from "react";
import { Col, Row, Container, Button} from 'react-bootstrap';
import mapboxgl from 'mapbox-gl'
import toGeoJson from '@mapbox/togeojson'
import {faLayerGroup, faMountainSun, faPersonRunning} from "@fortawesome/free-solid-svg-icons";
import API from "../API";
import Form from 'react-bootstrap/Form';
mapboxgl.accessToken = 'pk.eyJ1IjoieG9zZS1ha2EiLCJhIjoiY2xhYTk1Y2FtMDV3bzNvcGVhdmVrcjBjMSJ9.RJzgFhkHn2GnC-uNPiQ4fQ';


function SearchHut(props) {

    const mapContainer = useRef(null);
    const map = useRef(null);
    const [huts, setHuts] = useState(null);
    const [zoom, setZoom] = useState(11);
    const [bedsMin,setBedsMin] = useState('');
    const [altitudeMin,setAltitudeMin] = useState('');
    const [altitudeMax,setAltitudeMax] = useState('');
    const [longitude,setLongitude] = useState('');
    const [latitude,setLatitude] = useState('');
    const [city,setCity] = useState('');
    const [province,setProvince] = useState('');
    const [lng, setLng] = useState(7.662);      // Used to center the map on loading
    const [lat, setLat] = useState(45.062);
    const [refresh,setRefresh] = useState(false); // Do the not operation on this state to refresh huts
    const [markers,setMarkers] = useState([]);
    
    function updateMarkers(huts) {
        markers.forEach(marker => marker.remove());
        huts.forEach(hut => {
            const marker = new mapboxgl.Marker()
            .setLngLat([hut.point.location.coordinates[0], hut.point.location.coordinates[1]])
            .setPopup(
                new mapboxgl.Popup({ offset: 25 }) // add popups
                    .setHTML(
                        '<h3>' + hut.name + '</h3>' +
                        '<h5>Description: '+ hut.description +'<h5>'+
                        '<h5>Beds: ' + hut.beds + '<h5>' +
                        '<h5>Altitude: ' + hut.altitude + '<h5>' + 
                        '<h5>Coordinates: (' + hut.point.location.coordinates[1] + ',' + hut.point.location.coordinates[0] + ')<h5>' +
                        '<h5>City: ' + hut.city + '<h5>' + 
                        '<h5>Province: ' + hut.province + '<h5>' 
                    )
            );
            if(map.current)marker.addTo(map.current);
            setMarkers(old=>[...old,marker]);
        });
    }

    useEffect(()=>{
            const authToken = localStorage.getItem('token');
            if(latitude.trim().length !=0 && longitude.trim().length !=0 && longitude>=-180 && longitude<=180 && latitude>=-90 && latitude<=90)
            {
                if(map.current)map.current.flyTo({center: [longitude, latitude], zoom: 11});
            }
            API.getHuts(
                    bedsMin,
                    altitudeMin,
                    altitudeMax,
                    longitude,
                    latitude,
                    city,
                    province,
                    authToken)
                    .then(RetrievedHuts => {
                        setHuts(RetrievedHuts);
                        updateMarkers(RetrievedHuts);
                    })
                    .catch(err => console.log(err));
    },[refresh]);
    
    useEffect(() => {
        if (huts !== null) {
            if (map.current) return; // initialize map only once
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [lng, lat],
                zoom: zoom
            });

            map.current.on('load', () => {
                updateMarkers(huts);
            });
        }
    });

    return (
        <Container>
            <Row>
                <Col xl={3}>
                    <Container fluid>
                        <Row>
                            <Col>
                                    <MinPicker filter="beds" setMinFilter={setBedsMin} />
                                    <MinMaxPicker filter="altitude" setMinFilter={setAltitudeMin} setMaxFilter={setAltitudeMax} />
                                    <TextField filter="City" setFilter={setCity} />
                                    <TextField filter="Province" setFilter={setProvince} />
                                    <CoordinatesPicker setLongitude={setLongitude} setLatitude={setLatitude} />
                                    <Button onClick={(ev) => { setRefresh(oldValue=>!oldValue) }}>Search</Button>
                            </Col>
                        </Row>
                    </Container>
                </Col>
                <Col xl={9}>
                    <div ref={mapContainer} className="map-container" />
                </Col>
            </Row>
        </Container>
    );
}

function MinPicker(props) {
    const { filter, setMinFilter } = props;

    return (
        <Row className='basic-filter'>
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
        </Row>
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

export default SearchHut;