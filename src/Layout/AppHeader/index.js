import React, { Fragment, useState } from 'react'
import cx from 'classnames'
import { Button } from '@mui/material'

import { connect } from 'react-redux'

import { CSSTransition, TransitionGroup } from 'react-transition-group'
// import { useEffectOnce } from "../.././Translator/UseEffectOne.jsx";

import HeaderLogo from '../AppLogo'
import PageHeader from './header'
// import SearchBox from "./Components/SearchBox";
import MegaMenu from './Components/MegaMenu'
import UserBox from './Components/UserBox'
import GoogleTranslate from './newFile'
import HeaderDots from './Components/HeaderDots'

class Header extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      translate: false
    }
  }

 
 

  render () {
    let { headerBackgroundColor, enableMobileMenuSmall, enableHeaderShadow } =
      this.props
    return (
      <Fragment>
        <TransitionGroup>
          <CSSTransition
            style={{justifyContent:"space-between"}}
            component='div'
            className={cx('app-header', headerBackgroundColor, {
              'header-shadow': enableHeaderShadow
            })}
            appear={true}
            timeout={1500}
            enter={false}
            exit={false}
          >
           <div  className={cx('app-header__content', {
                  'header-mobile-open': enableMobileMenuSmall
                })}>
           <div>
              <HeaderLogo />
              </div>
              <div>
               
                <div className='app-header-right'>

                                  <UserBox/>
                                 

                
              
              </div>
            </div>
           </div>
          </CSSTransition>
        </TransitionGroup>
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  enableHeaderShadow: state.ThemeOptions.enableHeaderShadow,
  closedSmallerSidebar: state.ThemeOptions.closedSmallerSidebar,
  headerBackgroundColor: state.ThemeOptions.headerBackgroundColor,
  enableMobileMenuSmall: state.ThemeOptions.enableMobileMenuSmall
})

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
