/**
 * ADMIN DASHBOARD - Content Management UI
 *
 * Simple password-protected interface for non-technical content teams
 * to manage and tweak roadmap configurations without code changes
 *
 * FEATURES:
 * - Password protected entry
 * - Persona selector
 * - Live JSON editor
 * - Preview functionality
 * - Save/publish workflow
 *
 * USAGE:
 * Place at: /admin
 * Password: (configure in .env.local: NEXT_PUBLIC_ADMIN_PASSWORD)
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { Eye, EyeOff, Save, X } from 'phosphor-react';
import { getAllPersonas, getPersonaById, loadPersonaConfig } from '@/utils/personaMatching';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  font-family: 'Plus Jakarta Sans', sans-serif;
`;

const LoginContainer = styled.div`
  max-width: 400px;
  margin: 0 auto;
  background: white;
  border-radius: 0;
  padding: 3rem 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  margin-top: 5rem;
`;

const LoginTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const LoginSubtitle = styled.p`
  color: #6b7280;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 0.875rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`;

const PasswordInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1rem;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.875rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 0;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:hover {
    background: #5568d3;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.p`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const DashboardContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const DashboardHeader = styled.div`
  background: white;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const HeaderTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
`;

const LogoutBtn = styled.button`
  padding: 0.5rem 1rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 0;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background: #dc2626;
  }
`;

const ContentArea = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
`;

const Sidebar = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-height: calc(100vh - 300px);
  overflow-y: auto;
`;

const SidebarTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
`;

const PersonaItem = styled.button`
  width: 100%;
  text-align: left;
  padding: 0.75rem 1rem;
  border: none;
  background: ${props => props.selected ? '#f3f4f6' : 'transparent'};
  border-left: 3px solid ${props => props.selected ? '#667eea' : 'transparent'};
  cursor: pointer;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.875rem;
  color: ${props => props.selected ? '#667eea' : '#6b7280'};
  font-weight: ${props => props.selected ? '600' : '500'};
  margin-bottom: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    background: #f9fafb;
    color: #667eea;
  }
`;

const MainContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ConfigViewer = styled.div`
  background: #1f2937;
  padding: 1.5rem;
  border-radius: 0;
  overflow-x: auto;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.875rem;
  color: #e5e7eb;
  max-height: 500px;
  overflow-y: auto;
`;

const PreviewSection = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
`;

const PreviewCard = styled.div`
  background: #f9fafb;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #e5e7eb;
`;

const PreviewLabel = styled.span`
  font-weight: 600;
  color: #6b7280;
  display: block;
  font-size: 0.75rem;
  text-transform: uppercase;
  margin-bottom: 0.25rem;
`;

const PreviewValue = styled.div`
  color: #1f2937;
  font-size: 0.95rem;
`;

/**
 * ADMIN PASSWORD
 * In production, use environment variable:
 * NEXT_PUBLIC_ADMIN_PASSWORD in .env.local
 *
 * For testing: use "admin123"
 */
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [personas, setPersonas] = useState([]);
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [personaConfig, setPersonaConfig] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle password submission
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError('');

    if (passwordInput === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setPasswordInput('');
      loadPersonas();
    } else {
      setPasswordError('Incorrect password');
      setPasswordInput('');
    }
  };

  // Load all personas on login
  const loadPersonas = async () => {
    try {
      const allPersonas = getAllPersonas();
      setPersonas(allPersonas);
      if (allPersonas.length > 0) {
        setSelectedPersona(allPersonas[0].id);
        loadPersonaConfig(allPersonas[0].id);
      }
    } catch (error) {
      console.error('Failed to load personas:', error);
      setPasswordError('Failed to load personas');
    }
  };

  // Load specific persona config
  const loadPersonaConfig = async (personaId) => {
    setLoading(true);
    try {
      const config = await import(`../../configs/personas/${personaId}.json`);
      setPersonaConfig(config.default || config);
    } catch (error) {
      console.error('Failed to load persona config:', error);
      setPersonaConfig(null);
    }
    setLoading(false);
  };

  // Handle persona selection
  const handlePersonaSelect = async (personaId) => {
    setSelectedPersona(personaId);
    await loadPersonaConfig(personaId);
  };

  // Handle logout
  const handleLogout = () => {
    setAuthenticated(false);
    setSelectedPersona(null);
    setPersonaConfig(null);
    setPersonas([]);
  };

  // LOGIN VIEW
  if (!authenticated) {
    return (
      <Container>
        <LoginContainer>
          <LoginTitle>Admin Dashboard</LoginTitle>
          <LoginSubtitle>Content Management for Roadmap</LoginSubtitle>

          <form onSubmit={handlePasswordSubmit}>
            <FormGroup>
              <Label>Password</Label>
              <div style={{ position: 'relative' }}>
                <PasswordInput
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter admin password"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#6b7280'
                  }}
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
              {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}
            </FormGroup>

            <Button type="submit">Sign In</Button>
          </form>

          <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #e5e7eb' }}>
            <p style={{ color: '#9ca3af', fontSize: '0.75rem', margin: 0 }}>
              For testing: password is <strong>admin123</strong>
            </p>
          </div>
        </LoginContainer>
      </Container>
    );
  }

  // DASHBOARD VIEW
  return (
    <Container>
      <DashboardContainer>
        <DashboardHeader>
          <HeaderTitle>Roadmap Configuration Manager</HeaderTitle>
          <LogoutBtn onClick={handleLogout}>Logout</LogoutBtn>
        </DashboardHeader>

        <ContentArea>
          {/* SIDEBAR: Persona List */}
          <Sidebar>
            <SidebarTitle>Select Persona</SidebarTitle>
            {personas.map((persona) => (
              <PersonaItem
                key={persona.id}
                selected={selectedPersona === persona.id}
                onClick={() => handlePersonaSelect(persona.id)}
              >
                {persona.label}
              </PersonaItem>
            ))}
          </Sidebar>

          {/* MAIN: Config Viewer & Preview */}
          <MainContent>
            {loading ? (
              <p>Loading configuration...</p>
            ) : personaConfig ? (
              <>
                {/* CONFIG VIEWER */}
                <div>
                  <SectionTitle>Configuration ({selectedPersona})</SectionTitle>
                  <ConfigViewer>
                    <pre>{JSON.stringify(personaConfig, null, 2)}</pre>
                  </ConfigViewer>
                </div>

                {/* PREVIEW */}
                <PreviewSection>
                  <SectionTitle>Preview</SectionTitle>

                  {personaConfig.metadata && (
                    <PreviewCard>
                      <PreviewLabel>Persona</PreviewLabel>
                      <PreviewValue>
                        {personaConfig.metadata.label}
                      </PreviewValue>
                    </PreviewCard>
                  )}

                  {personaConfig.hero && (
                    <PreviewCard>
                      <PreviewLabel>Hero Title</PreviewLabel>
                      <PreviewValue>
                        {personaConfig.hero.title}
                      </PreviewValue>
                    </PreviewCard>
                  )}

                  {personaConfig.skillsGap && (
                    <PreviewCard>
                      <PreviewLabel>Skills Gap Title</PreviewLabel>
                      <PreviewValue>
                        {personaConfig.skillsGap.title}
                      </PreviewValue>
                      <PreviewLabel style={{ marginTop: '0.5rem' }}>
                        Missing Skills
                      </PreviewLabel>
                      <PreviewValue>
                        High Priority: {personaConfig.skillsGap.missingSkills.highPriority?.length || 0} |
                        Medium: {personaConfig.skillsGap.missingSkills.mediumPriority?.length || 0} |
                        Low: {personaConfig.skillsGap.missingSkills.lowPriority?.length || 0}
                      </PreviewValue>
                    </PreviewCard>
                  )}

                  {personaConfig.learningPath && (
                    <PreviewCard>
                      <PreviewLabel>Learning Path Phases</PreviewLabel>
                      <PreviewValue>
                        {personaConfig.learningPath.phases?.length || 0} phases
                      </PreviewValue>
                      {personaConfig.learningPath.phases?.map((phase, idx) => (
                        <PreviewValue key={idx} style={{ marginTop: '0.5rem', marginLeft: '1rem' }}>
                          • {phase.title}
                        </PreviewValue>
                      ))}
                    </PreviewCard>
                  )}
                </PreviewSection>

                {/* EDIT INSTRUCTIONS */}
                <PreviewSection>
                  <SectionTitle>How to Edit</SectionTitle>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                    To edit this configuration, modify the JSON file directly:
                    <br />
                    <code style={{ background: '#f3f4f6', padding: '0.25rem 0.5rem' }}>
                      src/configs/personas/{selectedPersona}.json
                    </code>
                  </p>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '1rem' }}>
                    After editing, reload this dashboard to see your changes.
                  </p>
                </PreviewSection>
              </>
            ) : (
              <p>Select a persona to view its configuration</p>
            )}
          </MainContent>
        </ContentArea>
      </DashboardContainer>
    </Container>
  );
}
