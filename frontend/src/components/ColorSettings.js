import React, { useState } from 'react';

function ColorSettings({ colorPrefs, updateColorPreferences }) {
  const [colors, setColors] = useState({
    high: colorPrefs.high,
    medium: colorPrefs.medium,
    low: colorPrefs.low
  });

  const handleColorChange = (priority, value) => {
    setColors({ ...colors, [priority]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateColorPreferences(colors);
  };

  const resetToDefaults = () => {
    const defaultColors = {
      high: '#f44336',
      medium: '#ff9800',
      low: '#8bc34a'
    };
    setColors(defaultColors);
    updateColorPreferences(defaultColors);
  };

  return (
    <div className="color-settings">
      <h2>Customize Priority Colors</h2>
      <form onSubmit={handleSubmit}>
        <div className="color-setting">
          <label>
            High Priority
            <div className="color-preview" style={{ backgroundColor: colors.high }}></div>
            <input 
              type="color" 
              value={colors.high} 
              onChange={(e) => handleColorChange('high', e.target.value)} 
            />
          </label>
        </div>
        
        <div className="color-setting">
          <label>
            Medium Priority
            <div className="color-preview" style={{ backgroundColor: colors.medium }}></div>
            <input 
              type="color" 
              value={colors.medium} 
              onChange={(e) => handleColorChange('medium', e.target.value)} 
            />
          </label>
        </div>
        
        <div className="color-setting">
          <label>
            Low Priority
            <div className="color-preview" style={{ backgroundColor: colors.low }}></div>
            <input 
              type="color" 
              value={colors.low} 
              onChange={(e) => handleColorChange('low', e.target.value)} 
            />
          </label>
        </div>
        
        <div className="color-setting-actions">
          <button type="submit" className="save-colors-btn">Save Colors</button>
          <button type="button" className="reset-colors-btn" onClick={resetToDefaults}>Reset to Defaults</button>
        </div>
      </form>
    </div>
  );
}

export default ColorSettings; 