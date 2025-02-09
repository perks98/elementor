import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { getRemoteConfig } from '../../../api';

const RemoteConfigContext = React.createContext( {} );

export const useRemoteConfig = () => React.useContext( RemoteConfigContext );

export const CONFIG_KEYS = {
	WEB_BASED_BUILDER_URL: 'webBasedBuilderUrl',
};

export const RemoteConfigProvider = ( props ) => {
	const [ isLoading, setIsLoading ] = useState( false );
	const [ isLoaded, setIsLoaded ] = useState( false );
	const [ isError, setIsError ] = useState( false );
	const [ remoteConfig, setRemoteConfig ] = useState( {} );

	const fetchData = async () => {
		setIsLoading( true );

		try {
			const result = await getRemoteConfig().finally( () => {
				setIsLoaded( true );
				setIsLoading( false );
			} );

			if ( ! result.config ) {
				throw new Error( 'Invalid remote config' );
			}

			setRemoteConfig( result.config );
		} catch ( error ) {
			setIsError( true );
			setIsLoaded( true );
			setIsLoading( false );
		}
	};

	if ( ! isLoaded && ! isLoading ) {
		fetchData();
	}

	return (
		<RemoteConfigContext.Provider
			value={ {
				isLoading,
				isLoaded,
				isError,
				remoteConfig,
			} }
		>
			{ props.children }
		</RemoteConfigContext.Provider>
	);
};

RemoteConfigProvider.propTypes = {
	children: PropTypes.node.isRequired,
	onError: PropTypes.func.isRequired,
};
