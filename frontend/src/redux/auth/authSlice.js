import { createSlice } from "@reduxjs/toolkit"
import { createProfileThunk, forgotPasswordThunk, loginThunk, logoutThunk, registerThunk, resendOtpThunk, resetPasswordThunk, verifyOtpThunk } from "./authThunk"
const initialState = {
    loading:false,
    error:null
}
const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{

        // Login Thunk
        builder.addCase(loginThunk.pending,(state)=>{
            state.loading=true
            state.error=null
        })
        builder.addCase(loginThunk.fulfilled,(state)=>{
            state.loading=false,
            state.error=null
        })
        builder.addCase(loginThunk.rejected,(state,action)=>{
            state.loading=false,
            state.error=action.payload
        })

        // Register Thunk
        builder.addCase(registerThunk.pending,(state)=>{
            state.loading=true
            state.error=null
        })
        builder.addCase(registerThunk.fulfilled,(state)=>{
            state.loading=false,
            state.error=null
        })
        builder.addCase(registerThunk.rejected,(state,action)=>{
            state.loading=false,
            state.error=action.payload
        })

        // Verify OTP Thunk
        builder.addCase(verifyOtpThunk.pending,(state)=>{
            state.loading=true
            state.error=null
        })
        builder.addCase(verifyOtpThunk.fulfilled,(state)=>{
            state.loading=false,
            state.error=null
        })
        builder.addCase(verifyOtpThunk.rejected,(state,action)=>{
            state.loading=false,
            state.error=action.payload
        })

        // Resend OTP Thunk
        builder.addCase(resendOtpThunk.pending,(state)=>{
            state.loading=true
            state.error=null
        })
        builder.addCase(resendOtpThunk.fulfilled,(state)=>{
            state.loading=false,
            state.error=null
        })
        builder.addCase(resendOtpThunk.rejected,(state,action)=>{
            state.loading=false,
            state.error=action.payload
        })

        // Create Profile Thunk
        builder.addCase(createProfileThunk.pending,(state)=>{
            state.loading=true
            state.error=null
        })
        builder.addCase(createProfileThunk.fulfilled,(state)=>{
            state.loading=false,
            state.error=null
        })
        builder.addCase(createProfileThunk.rejected,(state,action)=>{
            state.loading=false,
            state.error=action.payload
        })

        // Forgot Password Thunk
        builder.addCase(forgotPasswordThunk.pending,(state)=>{
            state.loading=true
            state.error=null
        })
        builder.addCase(forgotPasswordThunk.fulfilled,(state)=>{
            state.loading=false,
            state.error=null
        })
        builder.addCase(forgotPasswordThunk.rejected,(state,action)=>{
            state.loading=false,
            state.error=action.payload
        })

        // Reset Password Thunk
        builder.addCase(resetPasswordThunk.pending,(state)=>{
            state.loading=true
            state.error=null
        })
        builder.addCase(resetPasswordThunk.fulfilled,(state)=>{
            state.loading=false,
            state.error=null
        })
        builder.addCase(resetPasswordThunk.rejected,(state,action)=>{
            state.loading=false,
            state.error=action.payload
        })

        // Logout Thunk
        builder.addCase(logoutThunk.pending,(state)=>{
            state.loading=true
            state.error=null
        })
        builder.addCase(logoutThunk.fulfilled,(state)=>{
            state.loading=false,
            state.error=null
        })
        builder.addCase(logoutThunk.rejected,(state,action)=>{
            state.loading=false,
            state.error=action.payload
        })
    }
})

export default authSlice.reducer