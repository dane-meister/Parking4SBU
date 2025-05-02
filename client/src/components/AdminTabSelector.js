export default function AdminTabSelector({ adminOption, setAdminOption }) {
  // reusable key handler for all tabs
  const handleKeyDown = (e, option) => {
    if (e.key === 'Enter' || e.key === ' ') {
      setAdminOption(option);
    }
  };

  return (
    <div
      className="hbox selection"
      id="admin-selection"
      style={{ marginRight: '35px', justifyContent: 'flex-start' }}
    >
      <span
        className={'type-hover ' + (adminOption === 'users' ? 'selected' : '')}
        onClick={() => setAdminOption('users')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => handleKeyDown(e, 'users')}
      >Users</span>
      <span>/</span>
      <span
        className={'type-hover ' + (adminOption === 'lots' ? 'selected' : '')}
        onClick={() => setAdminOption('lots')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => handleKeyDown(e, 'lots')}
      >Lots</span>
      <span>/</span>
      <span
        className={'type-hover ' + (adminOption === 'events' ? 'selected' : '')}
        onClick={() => setAdminOption('events')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => handleKeyDown(e, 'events')}
      >Events</span>
      <span>/</span>
      <span
        className={'type-hover ' + (adminOption === 'analysis' ? 'selected' : '')}
        onClick={() => setAdminOption('analysis')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => handleKeyDown(e, 'analysis')}
      >Analysis</span>
      <span>/</span>
      <span
        className={'type-hover ' + (adminOption === 'feedback' ? 'selected' : '')}
        onClick={() => setAdminOption('feedback')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => handleKeyDown(e, 'feedback')}
      >Feedback</span>
    </div>
  );
}
