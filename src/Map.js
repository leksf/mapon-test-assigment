import { Map, Polyline, GoogleApiWrapper } from 'google-maps-react';
import { Component } from 'react';

const mapStyles = {
    width: '100%',
    height: '200px'
};

const containerStyle = {
    position: 'relative',
    width: '100%',
    height: '200px'
}

export class MapContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            polylinePath: []
        };
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.polyline !== this.props.polyline) {
            const polylinePath = this.props.polyline ? this.props.google.maps.geometry.encoding.decodePath(this.props.polyline) : null;

            if (polylinePath) {
                this.setState({
                    polylinePath: polylinePath.map(p => {return {lat:p.lat() , lng:p.lng()}})
                })
            }
        }
    }

    render() {
        if (!this.props.available) return null;

        return (
            <Map google={this.props.google}
                 zoom={7}
                 initialCenter={{
                     lat: 56.744260,
                     lng: 24.432547
                 }}
                 style={mapStyles}
                 containerStyle={containerStyle}>
                <Polyline
                    path={this.state.polylinePath}
                    strokeColor="#39b0fa"
                    strokeOpacity={1}
                    strokeWeight={3} />
            </Map>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY,
    libraries: ['geometry', 'places']
})(MapContainer)
