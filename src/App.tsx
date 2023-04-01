import { useEffect, useState } from "react";
import type { Data } from "./model/Data";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
// you need to import the styles for leaflet to work
import "leaflet/dist/leaflet.css";
// object to create an Icon
import { Icon } from "leaflet";
import ipRegex from "ip-regex";

// make a child component that can change the view of the map
function ChangeView({ center }: any) {
  const map = useMap();
  map.setView(center);
  return null;
}

const App = () => {
  //console.log(process.env.REACT_APP_TEST);
  const intVal = {
    country: "US",
    region: "California",
    city: "Mountain View",
    position: [37.40599, -122.078514],
    postalCode: "94043",
    timezone: "-07:00",
    isp: "Google LLC",
  };
  const [ip, setIp] = useState("");
  const [ipInput, setIpInput] = useState("");
  const [data, setData] = useState<Data>(intVal as Data);

  //storing the Ip in setIp
  useGetIp(setIp);

  // get the data using the ip and stor in Data state
  useGetData(setData, ip);

  // createing an Icon you give the url and the size to the Icon class
  const icon = new Icon({
    iconUrl: "/images/icon-location.svg",
    //  iconSize: [32, 32],
  });

  const handleClick = () => {
    if (!ipRegex({ exact: true }).test(ipInput)) return;
    setIp(ipInput);
    setIpInput("");
  };
  let locationValue = `${data.city},${data.region} ${data.postalCode}`;
  return (
    <div>
      <div className="top">
        <h1 className="heading"> IP Address Tracker</h1>
        <div className="input-container">
          <input
            type="text"
            className="input"
            placeholder="Search for any IP address or domain"
            value={ipInput}
            onChange={(e) => setIpInput(e.target.value)}
          />
          <button className="button" onClick={handleClick}>
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="14">
              <path
                fill="none"
                stroke="#FFF"
                strokeWidth="3"
                d="M2 1l6 6-6 6"
              />
            </svg>
          </button>
        </div>
        <div className="info">
          <div className="ip">
            <h2 className="title">IP ADDRESS</h2>
            <p className="body"> {ip} </p>
          </div>
          <div className="location">
            <h2 className="title">LOCATION</h2>
            <p
              className="body"
              style={{
                fontSize: `${locationValue.length >= 25 ? "14px" : "18px"}`,
              }}
            >
              {locationValue}
            </p>
          </div>
          <div className="timezone">
            <h2 className="title">TIMEZONE</h2>
            <p className="body">UTC {data.timezone}</p>
          </div>
          <div className="isp">
            <h2 className="title">ISP</h2>
            <p
              className="body"
              style={{
                fontSize: `${data.isp.length >= 25 ? "14px" : "18px"}`,
              }}
            >
              {data.isp}
            </p>
          </div>
        </div>
      </div>
      <MapContainer center={data.position} zoom={13}>
        <ChangeView center={data.position} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={data.position} icon={icon}>
          <Popup>This is your place</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

function useGetIp(setIp: React.Dispatch<React.SetStateAction<string>>) {
  useEffect(() => {
    //getting and storing the ip addrease using ipify
    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then(({ ip }) => setIp(ip))
      .catch((err) => console.error(err));

    return () => {
      return setIp("");
    };
  }, [setIp]);
}

function useGetData(
  setData: React.Dispatch<React.SetStateAction<Data>>,
  ip: string
) {
  // let apiKey = process.env.REACT_APP_API_KEY;
  let apiKey = "";
  let api = `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&ipAddress=${ip}`;
  //calling the api to gett the nedded information from the Ip
  useEffect(() => {
    fetch(api)
      .then((res) => res.json())
      .then((data) => {
        const neddedData = {
          country: data.location.country,
          region: data.location.region,
          city: data.location.city,
          position: [data.location.lat, data.location.lng],
          postalCode: data.location.postalCode,
          timezone: data.location.timezone,
          isp: data.isp,
        };
        if (neddedData) {
          setData(neddedData as Data);
        }
      })
      .catch((err) => console.error(err));
  }, [setData, api, ip]);
}
export default App;

// {
//   Alabama: "AL",
//   Alaska: "AK",
//   Arizona: "AZ",
//   Arkansas: "AR",
//   California: "CA",
//   Colorado: "CO",
//   Connecticut: "CT",
//   Delaware: "DE",
//   Florida: "FL",
//   Georgia: "GA",
//   Hawaii: "HI",
//   Idaho: "ID",
//   Illinois: "IL",
//   Indiana: "IN",
//   Iowa: "IA",
//   Kansas: "KS",
//   Kentucky: "KY",
//   Louisiana: "LA",
//   Maine: "ME",
//   Maryland: "MD",
//   Massachusetts:"MA",
//   Michigan:"MI",
//   Minnesota:"MN",
//   Mississippi:"MS",
//   Missouri:"MO",
//  Montana:"MT",
//  Nebraska:"NE",
//  Nevada:"NV",
//  New Hampshire:"NH",
//  New Jersey:"NJ",
//  New Mexico:"NM",
//  New York:"NY",
//  North Carolina:"NC",
//  North Dakota:"ND",
//  Ohio:"OH",
//  Oklahoma:"OK",
//  Oregon:"OR", Pennsylvania:
// "PA" Rhode Island:
// "RI" South Carolina:
// "SC" South Dakota:
// "SD" Tennessee:
// "TN" Texas:
// "TX" Utah:
// "UT"
//  Vermont:
// "VT"
//  Virginia:
// "VA"
//  Washington:
// "WA"
//  West Virginia:
// "WV"
//  Wisconsin:
// "WI"
//  Wyoming:
// "WY"
// }
