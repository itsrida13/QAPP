import React from 'react';
import { render } from '@testing-library/react-native';
import App from './App';

describe('App Navigation', () => {
  it('renders the Home screen by default', async () => {
    const { getByText } = render(<App />);
    
    // Since HomeScreen is the initial screen, test for any known text from HomeScreen
   
    expect(getByText('Surah List')).toBeTruthy();
    expect(getByText('Settings')).toBeTruthy();
  });
});
