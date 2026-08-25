const profileService =
    require("../_services/profileServices");


// =========================================
// GET PROFILE
// =========================================

const getProfile = async (
    req,
    res,
    next
) => {

    try {

        const userId =
            req.user.id;


        const profile =
            await profileService.getProfile(
                userId
            );


        if (!profile) {

            return res.status(404).json({

                success: false,

                message:
                    "User profile not found."

            });

        }


        return res.status(200).json({

            success: true,

            data: profile

        });

    } catch (error) {

        next(error);

    }

};


// =========================================
// UPDATE PROFILE
// =========================================

const updateProfile = async (
    req,
    res,
    next
) => {

    try {

        const userId =
            req.user.id;


        const {
            name,
            email,
            profile_image
        } = req.body;


        if (!name || !name.trim()) {

            return res.status(400).json({

                success: false,

                message:
                    "Name is required."

            });

        }


        if (!email || !email.trim()) {

            return res.status(400).json({

                success: false,

                message:
                    "Email is required."

            });

        }


        const profile =
            await profileService.updateProfile(
                userId,
                {
                    name: name.trim(),
                    email: email.trim(),
                    profile_image:
                        profile_image || null
                }
            );


        if (!profile) {

            return res.status(404).json({

                success: false,

                message:
                    "User profile not found."

            });

        }


        return res.status(200).json({

            success: true,

            message:
                "Profile updated successfully.",

            data: profile

        });

    } catch (error) {

        next(error);

    }

};


// =========================================
// EXPORT
// =========================================

module.exports = {
    getProfile,
    updateProfile
};