import React from 'react';
import { useHistory } from 'react-router-dom';
import './index.less'

function Header() {
  const token = localStorage.getItem('token');
  const history = useHistory();
  if (!token) {
    history.push('/login')
  }
  return (
    <div className="header">
      这是头部
    </div>
  )
}

export default Header