const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

describe('Configuration Update Script', () => {
  let tempDir;
  let configPath;
  
  beforeEach(() => {
    // Create a temporary directory for testing
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mcp-test-'));
    configPath = path.join(tempDir, 'claude_desktop_config.json');
  });
  
  afterEach(() => {
    // Clean up the temporary directory
    fs.rmSync(tempDir, { recursive: true, force: true });
  });
  
  it('should create a new config file if it does not exist', () => {
    // Run the update script with the test config path
    const scriptPath = path.resolve(__dirname, '../update-config.js');
    execSync(`node ${scriptPath} ${configPath}`);
    
    // Verify the config file was created
    expect(fs.existsSync(configPath)).toBe(true);
    
    // Read and parse the config
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    
    // Verify the structure
    expect(config).toHaveProperty('mcpServers');
    expect(config.mcpServers).toHaveProperty('sequential-thinking');
    expect(config.mcpServers['sequential-thinking']).toHaveProperty('command', 'npx');
  });
  
  it('should update an existing config file without overwriting other settings', () => {
    // Create an existing config with some settings
    const existingConfig = {
      someOtherSetting: 'value',
      mcpServers: {
        'another-server': {
          command: 'some-command',
          args: ['arg1', 'arg2']
        }
      }
    };
    
    // Write the existing config
    fs.writeFileSync(configPath, JSON.stringify(existingConfig, null, 2));
    
    // Run the update script
    const scriptPath = path.resolve(__dirname, '../update-config.js');
    execSync(`node ${scriptPath} ${configPath}`);
    
    // Read and parse the updated config
    const updatedConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    
    // Verify that original settings were preserved
    expect(updatedConfig).toHaveProperty('someOtherSetting', 'value');
    expect(updatedConfig.mcpServers).toHaveProperty('another-server');
    expect(updatedConfig.mcpServers['another-server']).toHaveProperty('command', 'some-command');
    
    // Verify that new settings were added
    expect(updatedConfig.mcpServers).toHaveProperty('sequential-thinking');
    expect(updatedConfig.mcpServers['sequential-thinking']).toHaveProperty('command', 'npx');
  });
  
  it('should handle malformed JSON in the config file', () => {
    // Create a malformed config file
    fs.writeFileSync(configPath, '{ this is not valid JSON }');
    
    // Run the update script and expect it to fail
    const scriptPath = path.resolve(__dirname, '../update-config.js');
    try {
      execSync(`node ${scriptPath} ${configPath}`);
      // If we get here, the script didn't throw an error
      fail('Expected script to throw an error for malformed JSON');
    } catch (error) {
      // This is expected
      expect(error.status).not.toBe(0);
    }
  });
});
