import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [loading, setLoading] = useState({ countries: false, states: false, cities: false });

  const apiKey = 'apiKey';

  useEffect(() => {
    const fetchCountries = async () => {
      setLoading((prev) => ({ ...prev, countries: true }));
      try {
        const response = await axios.get('https://api.countrystatecity.in/v1/countries', {
          headers: { 'X-CSCAPI-KEY': apiKey },
        });
        setCountries(response.data);
      } catch (error) {
        console.error('Error fetching countries:', error);
      } finally {
        setLoading((prev) => ({ ...prev, countries: false }));
      }
    };

    fetchCountries();
  }, []);

  const fetchStates = async (countryCode) => {
    setSelectedCountry(countryCode);
    setStates([]);
    setCities([]);
    setLoading((prev) => ({ ...prev, states: true }));
    try {
      const response = await axios.get(
        `https://api.countrystatecity.in/v1/countries/${countryCode}/states`,
        { headers: { 'X-CSCAPI-KEY': apiKey } }
      );
      setStates(response.data);
    } catch (error) {
      console.error('Error fetching states:', error);
    } finally {
      setLoading((prev) => ({ ...prev, states: false }));
    }
  };

  const fetchCities = async (stateCode) => {
    setSelectedState(stateCode);
    setCities([]);
    setLoading((prev) => ({ ...prev, cities: true }));
    try {
      const response = await axios.get(
        `https://api.countrystatecity.in/v1/countries/${selectedCountry}/states/${stateCode}/cities`,
        { headers: { 'X-CSCAPI-KEY': apiKey } }
      );
      setCities(response.data);
    } catch (error) {
      console.error('Error fetching cities:', error);
    } finally {
      setLoading((prev) => ({ ...prev, cities: false }));
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4 text-primary">Country, State, and City</h1>

      <div className="mb-4 mt-5">
        <label className="form-label">Select Country</label>
        <select
          onChange={(e) => fetchStates(e.target.value)}
          className="form-select"
          defaultValue=""
        >
          <option value="" disabled>
            {loading.countries ? 'Loading countries...' : '-- Choose a Country --'}
          </option>
          {countries.map((country) => (
            <option key={country.iso2} value={country.iso2}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4 mt-5">
        <label className="form-label">Select State</label>
        <select
          onChange={(e) => fetchCities(e.target.value)}
          className="form-select"
          defaultValue=""
          disabled={!selectedCountry || loading.states}
        >
          <option value="" disabled>
            {loading.states ? 'Loading states...' : '-- Choose a State --'}
          </option>
          {states.map((state) => (
            <option key={state.iso2} value={state.iso2}>
              {state.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4 mt-5">
        <label className="form-label">Select City</label>
        <select
          className="form-select"
          defaultValue=""
          disabled={!selectedState || loading.cities}
        >
          <option value="" disabled>
            {loading.cities ? 'Loading cities...' : '-- Choose a City --'}
          </option>
          {cities.map((city) => (
            <option key={city.id} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Home;