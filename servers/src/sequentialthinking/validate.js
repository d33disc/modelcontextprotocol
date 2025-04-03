/**
 * JSON Schema Validator for Sequential Thinking MCP Server
 * 
 * This script validates the JSON schema used in the server implementation
 * to ensure it's properly formatted before running the server.
 */

const fs = require('fs');
const path = require('path');

// Read the schema from the server file
try {
  const serverFile = fs.readFileSync(path.join(__dirname, 'index.js'), 'utf8');
  
  // Extract the schema object from the file
  const schemaMatch = serverFile.match(/const sequentialThinkingSchema = ({[\s\S]*?});/);
  
  if (!schemaMatch) {
    console.error('❌ Could not find schema definition in server file');
    process.exit(1);
  }
  
  const schemaText = schemaMatch[1];
  
  try {
    // Safer evaluation approach that doesn't rely on JSON.parse
    // This avoids issues with JavaScript object notation vs. strict JSON
    let schema;
    try {
      // First try to directly evaluate the schema
      // eslint-disable-next-line no-eval
      schema = eval(`(${schemaText})`);
    } catch (evalError) {
      // If direct eval fails, try JSON parsing with handling for single quotes
      schema = JSON.parse(
        schemaText
          .replace(/'/g, '"')           // Replace single quotes with double quotes
          .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
      );
    }
    
    // Validate required schema properties
    if (!schema.name || typeof schema.name !== 'string') {
      throw new Error('Schema missing required "name" property or it is not a string');
    }
    
    if (!schema.parameters || typeof schema.parameters !== 'object') {
      throw new Error('Schema missing required "parameters" property or it is not an object');
    }
    
    if (!schema.returns || typeof schema.returns !== 'object') {
      throw new Error('Schema missing required "returns" property or it is not an object');
    }
    
    console.log('✅ Schema validation successful!');
    console.log('\nSchema structure:');
    console.log('- Tool name:', schema.name);
    console.log('- Parameters:', Object.keys(schema.parameters.properties || {}).length);
    console.log('- Required parameters:', (schema.parameters.required || []).join(', '));
    console.log('- Return properties:', Object.keys(schema.returns.properties || {}).length);
    console.log('- Required return properties:', (schema.returns.required || []).join(', '));
  } catch (parseError) {
    console.error('❌ Schema validation failed!');
    console.error('Error:', parseError.message);
    console.error('\nInvalid schema structure. Check for:');
    console.error('- Missing commas between properties');
    console.error('- Trailing commas (not allowed in JSON)');
    console.error('- Unquoted property names');
    console.error('- Single quotes instead of double quotes');
    process.exit(1);
  }
} catch (readError) {
  console.error('❌ Could not read server file:', readError.message);
  process.exit(1);
}
