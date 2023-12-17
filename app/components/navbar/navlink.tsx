import React from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition, faBell, faHouse, faUserAlt } from '@fortawesome/free-solid-svg-icons';

interface Props {
  icon: string,
  url: string
}

const NavLink = (props: Props) => {
  const { icon, url } = props;
  let iconToRender: IconDefinition;

  switch (icon) {
    case 'Home': iconToRender = faHouse;
      break;
    case 'Notification': iconToRender = faBell;
      break;
    case 'Profile': iconToRender = faUserAlt;
      break;
    default: iconToRender = faHouse;
      break;
  }

  return (
    <>
      <Link className='hover:text-green-700 lg:text-xl lg:p-4 p-3 flex items-center' key={url} href={url}>
        <FontAwesomeIcon icon={iconToRender} />
      </Link>
    </>
  )
}

export default NavLink
