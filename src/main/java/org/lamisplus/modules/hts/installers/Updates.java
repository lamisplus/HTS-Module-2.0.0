package org.lamisplus.modules.hts.installers;

import com.foreach.across.core.annotations.Installer;
import com.foreach.across.core.installers.AcrossLiquibaseInstaller;
import org.springframework.core.annotation.Order;

@Order(2)
@Installer(name = "schema-installer-update", description = "Updates the required database tables data",
        version = 6)
public class Updates extends AcrossLiquibaseInstaller {
    public Updates() {
        super("classpath:installers/hts/updates.xml");
    }
}
