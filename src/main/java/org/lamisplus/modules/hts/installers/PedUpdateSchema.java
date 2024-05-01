package org.lamisplus.modules.hts.installers;

import com.foreach.across.core.annotations.Installer;
import com.foreach.across.core.installers.AcrossLiquibaseInstaller;
import org.springframework.core.annotation.Order;

@Order(4)
@Installer(
        name = "ped-update-schema",
        description = "Remove PED from target group the required database tables data",
        version = 2
)
public class PedUpdateSchema  extends AcrossLiquibaseInstaller {
    public PedUpdateSchema() {
        super("classpath:installers/hts/ped_update.xml");
    }
}
