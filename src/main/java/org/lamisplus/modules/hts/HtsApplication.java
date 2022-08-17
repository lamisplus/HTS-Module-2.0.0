package org.lamisplus.modules.hts;

import com.foreach.across.AcrossApplicationRunner;
import com.foreach.across.config.AcrossApplication;

@AcrossApplication(
		modules = {
				
		}
)
public class HtsApplication
{
	public static void main( String[] args ) {
		AcrossApplicationRunner.run( HtsApplication.class, args );
	}
}
